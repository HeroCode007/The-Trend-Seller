/**
 * Image Compression Utility
 * Compresses images client-side before uploading to reduce file size and improve performance
 */

/**
 * Compresses an image file to reduce size while maintaining quality
 * @param {File} file - The image file to compress
 * @param {Object} options - Compression options
 * @returns {Promise<File>} - The compressed image file
 */
export async function compressImage(file, options = {}) {
    const {
        maxSizeMB = 1, // Target size in MB
        maxWidthOrHeight = 1920, // Max dimension
        quality = 0.8, // Quality (0-1)
        fileType = file.type // Output file type
    } = options;

    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();

            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Calculate new dimensions while maintaining aspect ratio
                if (width > height) {
                    if (width > maxWidthOrHeight) {
                        height = Math.round((height * maxWidthOrHeight) / width);
                        width = maxWidthOrHeight;
                    }
                } else {
                    if (height > maxWidthOrHeight) {
                        width = Math.round((width * maxWidthOrHeight) / height);
                        height = maxWidthOrHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');

                // Enable image smoothing for better quality
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';

                // Draw the image
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to blob with compression
                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('Canvas to Blob conversion failed'));
                            return;
                        }

                        // Check if compression was effective
                        if (blob.size > file.size) {
                            // Original is smaller, use it instead
                            resolve(file);
                            return;
                        }

                        // Check if we need further compression
                        const targetSize = maxSizeMB * 1024 * 1024;
                        if (blob.size > targetSize && quality > 0.5) {
                            // Recursively compress with lower quality
                            const newQuality = Math.max(0.5, quality - 0.1);
                            canvas.toBlob(
                                (newBlob) => {
                                    // Fall back to first-pass result if second pass fails (e.g. Safari + WebP)
                                    const finalBlob = newBlob || blob;
                                    const compressedFile = new File(
                                        [finalBlob],
                                        file.name,
                                        { type: fileType }
                                    );
                                    resolve(compressedFile);
                                },
                                fileType,
                                newQuality
                            );
                        } else {
                            // Create a new File object from the blob
                            const compressedFile = new File(
                                [blob],
                                file.name,
                                { type: fileType }
                            );
                            resolve(compressedFile);
                        }
                    },
                    fileType,
                    quality
                );
            };

            img.onerror = () => {
                reject(new Error('Image loading failed'));
            };

            img.src = e.target.result;
        };

        reader.onerror = () => {
            reject(new Error('File reading failed'));
        };

        reader.readAsDataURL(file);
    });
}

/**
 * Gets the size of a file in a human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
export function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Validates if a file is an image
 * @param {File} file - The file to validate
 * @returns {boolean} - True if file is an image
 */
export function isImageFile(file) {
    return file && file.type.startsWith('image/');
}

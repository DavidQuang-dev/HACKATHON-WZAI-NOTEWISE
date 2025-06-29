// src/modules/document/config/file-types.config.ts
export const FILE_UPLOAD_CONFIG = {
  // Document files
  DOCUMENTS: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ],

  // Audio files (phổ biến)
  AUDIO: [
    'audio/mpeg', // MP3
    'audio/mp3', // MP3
    'audio/wav', // WAV
    'audio/aac', // AAC
    'audio/webm', // WebM (thêm để hỗ trợ)
    'audio/x-m4a'
  ],

  // Video files (chỉ MP4)
  VIDEO: [
    'video/mp4', // MP4
  ],

  // Size limits (bytes)
  MAX_FILE_SIZE: 25 * 1024 * 1024, // 25MB (tăng cho file âm thanh)
  MAX_FILENAME_LENGTH: 100,

  // Get all allowed types
  getAllowedTypes(): string[] {
    return [...this.DOCUMENTS, ...this.AUDIO, ...this.VIDEO];
  },

  // Get file extensions mapping
  getExtensionsMapping(): Record<string, string> {
    return {
      'application/pdf': 'PDF',
      'application/msword': 'DOC',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        'DOCX',
      'text/plain': 'TXT',
      'audio/mpeg': 'MP3',
      'audio/mp3': 'MP3',
      'audio/wav': 'WAV',
      'audio/aac': 'AAC',
      'video/mp4': 'MP4',
      'audio/webm': 'WEBM',
      'audio/x-m4a': 'M4A',
    };
  },
};

export const TOPIC_VALIDATION = {
  NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100,
  },
  DESCRIPTION: {
    MAX_LENGTH: 500,
  },
  IMAGE: {
    ACCEPTED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    MAX_SIZE: 5 * 1024 * 1024, 
  },
};

export const TOPIC_ERRORS = {
  NAME_REQUIRED: 'Tên chủ đề là bắt buộc',
  NAME_TOO_SHORT: 'Tên chủ đề phải có ít nhất 1 ký tự',
  NAME_TOO_LONG: 'Tên chủ đề không được vượt quá 100 ký tự',
  DESCRIPTION_TOO_LONG: 'Mô tả không được vượt quá 500 ký tự',
  INVALID_IMAGE_TYPE: 'Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WebP)',
  IMAGE_TOO_LARGE: 'Kích thước file ảnh không được vượt quá 5MB',
};

export const TOPIC_MESSAGES = {
  CREATE_SUCCESS: 'Tạo chủ đề thành công',
  UPDATE_SUCCESS: 'Cập nhật chủ đề thành công',
  DELETE_SUCCESS: 'Xóa chủ đề thành công',
  BULK_CREATE_SUCCESS: 'Tạo hàng loạt chủ đề thành công',
  BULK_UPDATE_SUCCESS: 'Cập nhật hàng loạt chủ đề thành công',
  NO_CHANGES: 'Không có thay đổi nào để cập nhật',
};


export const validateTopicName = (name: string): string | null => {
  if (!name.trim()) {
    return TOPIC_ERRORS.NAME_REQUIRED;
  }
  if (name.length < TOPIC_VALIDATION.NAME.MIN_LENGTH) {
    return TOPIC_ERRORS.NAME_TOO_SHORT;
  }
  if (name.length > TOPIC_VALIDATION.NAME.MAX_LENGTH) {
    return TOPIC_ERRORS.NAME_TOO_LONG;
  }
  return null;
};

export const validateTopicDescription = (description: string): string | null => {
  if (description.length > TOPIC_VALIDATION.DESCRIPTION.MAX_LENGTH) {
    return TOPIC_ERRORS.DESCRIPTION_TOO_LONG;
  }
  return null;
};

export const validateImageFile = (file: File): string | null => {
  if (!TOPIC_VALIDATION.IMAGE.ACCEPTED_TYPES.includes(file.type)) {
    return TOPIC_ERRORS.INVALID_IMAGE_TYPE;
  }
  if (file.size > TOPIC_VALIDATION.IMAGE.MAX_SIZE) {
    return TOPIC_ERRORS.IMAGE_TOO_LARGE;
  }
  return null;
};

export const hasFormChanges = (
  originalTopic: any, 
  formData: any, 
  hasNewImage: boolean
): boolean => {
  if (hasNewImage) return true;
  if (originalTopic.name !== formData.name) return true;
  if (originalTopic.description !== formData.description) return true;
  return false;
};

export const getImagePreviewUrl = (file: File | null, currentImageUrl: string = ''): string => {
  if (file) {
    return URL.createObjectURL(file);
  }
  return currentImageUrl;
};

export const cleanupImagePreview = (previewUrl: string) => {
  if (previewUrl && previewUrl.startsWith('blob:')) {
    URL.revokeObjectURL(previewUrl);
  }
};
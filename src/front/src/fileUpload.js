import { message } from "antd";

/**
 * Function to turn File into base64 string then pass control to
 * callback. Taken from Ant Design's docs.
 * @param {File} img - The new image user's trying to upload.
 * @param {Function} callback - Function to run after FileReader has
 * loaded the `img` successfully.
 * @returns {void}
 */
export function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

/**
 * Function to ensure uploaded image's type is jpeg/png and smaller than 2MB.
 * Taken from Ant Design's docs.
 * @param {File} file - The new image user's trying to upload.
 * @returns {void}
 */
export function beforeUpload(file) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return false;
}

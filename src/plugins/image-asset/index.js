import { Editor } from "el/editor/manager/Editor";
import ImageAssetPicker from "./ImageAssetPicker";
import ImageAssetsProperty from "./ImageAssetsProperty";

/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerElement({
        ImageAssetPicker,
        ImageAssetsProperty
    })
}
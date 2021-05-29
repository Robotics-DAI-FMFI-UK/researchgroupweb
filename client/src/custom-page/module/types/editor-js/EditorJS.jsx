import React, { useEffect, useRef } from "react";
import EditorJs from "react-editor-js";
import DragDrop from "editorjs-drag-drop";
import Undo from "editorjs-undo";
import { EDITOR_JS_TOOLS } from "./tools";
import { useModeContext } from "../../../../providers/ModeProvider";
import { useActiveModuleContext } from "../../../ActiveModuleProvider";

const EditorJS = ({ module, hasEditPermission }) => {
  const [editMode] = useModeContext();

  const editor = useRef();
  const { activeModule, updateActiveModule, toggleActiveModule } =
    useActiveModuleContext();

  useEffect(() => {
    console.log("Editor REF", editor);
  }, [editor]);

  const handleSave = async () => {
    const savedData = await editor.current.save();
    const updatedModule = { ...module, body: savedData };
    console.log("saved data", savedData);
    if (!activeModule || activeModule._id !== module._id) {
      toggleActiveModule(updatedModule);
    }
    updateActiveModule(updatedModule);
  };

  const readOnly = !editMode || !hasEditPermission;

  return (
    <EditorJs
      placeholder="Let`s write an awesome story!"
      instanceRef={(instance) => (editor.current = instance)}
      data={module.body}
      tools={EDITOR_JS_TOOLS}
      readOnly={readOnly}
      onChange={handleSave}
      onReady={() => {
        if (!readOnly && editor && editMode.current) {
          new Undo({ editor: editor.current });
          new DragDrop(editor.current);
        }
      }}
    />
  );
};

export default EditorJS;

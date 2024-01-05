import React, { useState, useRef } from "react";
import { Tag, Input, Tooltip } from "antd";

const InputsTags = () => {
  const [tags, setTags] = useState(["Unremovable", "Tag 2", "Tag 3"]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const inputRef = useRef(null);

  const handleClose = (removedTag) => {
    const updatedTags = tags.filter((tag) => tag !== removedTag);
    setTags(updatedTags);
  };

  const showInput = () => {
    setInputVisible(true);
    setTimeout(() => inputRef.current.focus(), 0);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue("");
  };

  return (
    <div>
      {tags.map((tag, index) => {
        const isLongTag = tag.length > 20;
        const tagElem = (
          <Tag
            key={tag}
            closable={index !== 0}
            onClose={() => handleClose(tag)}
          >
            {isLongTag ? `${tag.slice(0, 20)}...` : tag}
          </Tag>
        );
        return isLongTag ? (
          <Tooltip title={tag} key={tag}>
            {tagElem}
          </Tooltip>
        ) : (
          tagElem
        );
      })}
      {inputVisible && (
        <Input
          ref={inputRef}
          type="text"
          size="small"
          style={{ width: 78 }}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      )}
      {!inputVisible && (
        <Tag
          onClick={showInput}
          style={{ background: "#fff", borderStyle: "dashed" }}
        >
          New Tag
        </Tag>
      )}
    </div>
  );
};

export default InputsTags;

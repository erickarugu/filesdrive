"use client";

import { useState } from "react";
import { UploadsHead } from "./uploads-head";
import { UploadsTable } from "./uploads-table";

export function UploadsClient() {
  const [searchText, setSearchText] = useState("");

  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
  };

  return (
    <>
      <UploadsHead
        setSearchText={handleSearchTextChange}
        searchText={searchText}
      />
      <UploadsTable searchText={searchText} />
    </>
  );
}

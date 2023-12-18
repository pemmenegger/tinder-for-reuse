import { CollectorCreateForm } from "@/components/forms/CollectorForm";
import { useRouter } from "next/router";
import React from "react";
import toast from "react-hot-toast";

const CollectorUploadPage = () => {
  const router = useRouter();
  return (
    <>
      <h2>Create Collector</h2>
      <CollectorCreateForm
        onSuccess={() => {
          toast.success("Collector created");
          router.push("/building-elements/collectors");
        }}
      />
    </>
  );
};

export default CollectorUploadPage;

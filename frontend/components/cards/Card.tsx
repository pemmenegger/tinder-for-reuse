import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { PencilIcon as PencilIconOutline } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { EditFormProps } from "../forms/forms";
import { IGNORE_CARD_DEACTIVATION_CLASS } from "../search/SearchWithMapResultsWrapper";

interface CardProps extends React.ComponentProps<"div"> {
  isActive?: boolean;
  activeClassName?: string;
  attributes: Attribute[];
}

function Card({ activeClassName, isActive, attributes, ...props }: CardProps) {
  const activeClass = isActive ? activeClassName : "border-gray/40";
  const combinedClassNames = `relative bg-white border shadow-sm rounded-xl p-5 ${activeClass} ${
    props.className || ""
  }`;
  return (
    <div {...props} className={combinedClassNames}>
      {props.children}
    </div>
  );
}

interface Attribute {
  label: string;
  value: any;
}

interface CardGridProps extends React.ComponentProps<"div"> {
  attributes: Attribute[];
}

export default function CardGrid({ attributes, ...props }: CardGridProps) {
  return (
    <div {...props} className="grid grid-cols-2">
      {attributes.map((attribute) => {
        if (attribute.value === null || attribute.value === undefined) {
          return null;
        }
        return (
          <React.Fragment key={attribute.label}>
            <p>{attribute.label}</p>
            <p>
              {Array.isArray(attribute.value)
                ? attribute.value.join(", ")
                : attribute.value}
            </p>
          </React.Fragment>
        );
      })}
    </div>
  );
}

interface CardEditableProps extends CardProps {
  name: string;
  data: any;
  EditForm: React.ComponentType<EditFormProps>;
}

export function CardEditable({
  name,
  data,
  EditForm,
  ...props
}: CardEditableProps) {
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isEditing) {
      console.log(`isEditing with id ${data.id}`);
    } else {
      console.log(`is not editing with id ${data.id}`);
    }
  }, [isEditing]);

  return (
    <Card {...props}>
      {isEditing ? (
        <EditForm
          onCancel={() => setIsEditing(false)}
          onSuccess={() => {
            toast.success(`${name} successfully updated`);
            setIsEditing(false);
          }}
          defaultValues={data}
          dataId={data.id}
        />
      ) : (
        <>
          <CardGrid attributes={props.attributes} />
          <div
            className={`absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 ${IGNORE_CARD_DEACTIVATION_CLASS}`}
          >
            <Button variant="secondary" onClick={() => setIsEditing(true)}>
              <PencilIconOutline className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}

export function CardReadable({ ...props }: CardProps) {
  return (
    <Card {...props}>
      <CardGrid attributes={props.attributes} />
    </Card>
  );
}

export function CardSkeleton() {
  const skeletonLines = new Array(10).fill(null);

  const renderSkeletonLine = () => {
    return (
      <>
        <div className="h-[1rem] w-2/5 bg-gray-200 rounded"></div>
        {/* Label placeholder */}
        <div className="h-[1rem] w-3/5 bg-gray-300 rounded"></div>
        {/* Value placeholder */}
      </>
    );
  };

  return (
    <div className="grid grid-cols-2 gap-4 mt-8 bg-white shadow-sm border border-gray-200 rounded-xl p-5 animate-pulse">
      {skeletonLines.map((_, index) => (
        <React.Fragment key={index}>{renderSkeletonLine()}</React.Fragment>
      ))}
    </div>
  );
}

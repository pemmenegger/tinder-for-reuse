import React, { useState } from "react";
import { Button } from "../ui/button";
import { PencilIcon as PencilIconOutline } from "@heroicons/react/24/outline";
import { ChevronDownIcon as ChevronDownIconOutline } from "@heroicons/react/24/outline";
import { ChevronUpIcon as ChevronUpIconOutline } from "@heroicons/react/24/outline";
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
  const renderAttributeValue = (value: any) => {
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    return value;
  };

  return (
    <div {...props} className="grid grid-cols-2">
      {attributes.map(({ label, value }) => {
        if (!value && typeof value !== "boolean") return null;

        return (
          <React.Fragment key={label}>
            <p>{label}</p>
            <p>{renderAttributeValue(value)}</p>
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

  return (
    <Card {...props}>
      {isEditing ? (
        <EditForm
          onCancel={() => setIsEditing(false)}
          onDeleted={() => {
            toast.success(`${name} successfully deleted`);
            setIsEditing(false);
          }}
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

export function CardReadableCollapsible({ ...props }: CardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Card {...props}>
      <CardGrid attributes={props.attributes} />
      {isCollapsed && (
        <>
          <div className="mt-8"></div>
          {props.children}
        </>
      )}
      <div
        className={`absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 ${IGNORE_CARD_DEACTIVATION_CLASS}`}
      >
        <Button
          variant="secondary"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronUpIconOutline className="h-4 w-4" />
          ) : (
            <ChevronDownIconOutline className="h-4 w-4" />
          )}
        </Button>
      </div>
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

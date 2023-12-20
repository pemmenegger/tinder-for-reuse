export interface EditFormProps {
  onCancel: () => void | Promise<void>;
  onDeleted: () => void | Promise<void>;
  onSuccess: () => void | Promise<void>;
  dataId: number;
  defaultValues: any;
}

export interface EditFormProps {
  onCancel: () => void | Promise<void>;
  onSuccess: () => void | Promise<void>;
  dataId: number;
  defaultValues: any;
}

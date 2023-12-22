export interface ResultCardProps extends React.ComponentProps<"div"> {
  isActive?: boolean;
  data: any;
}

export type MapMarker = {
  id: number;
  latitude: number;
  longitude: number;
  iconUrl: string;
  iconScaledSize: {
    width: number;
    height: number;
  };
  results: any[];
  ResultCard: React.ComponentType<ResultCardProps>;
};

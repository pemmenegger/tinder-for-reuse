export interface ResultCardProps extends React.ComponentProps<"div"> {
  isActive?: boolean;
  data: any;
}

export type MapMarker = {
  id: number;
  lat: number;
  lng: number;
  iconUrl: string;
  iconScaledSize: {
    width: number;
    height: number;
  };
  results: any[];
  ResultCard: React.ComponentType<ResultCardProps>;
};

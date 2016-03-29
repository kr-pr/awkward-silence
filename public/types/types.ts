export interface TrackData {
  time: number;
  data: number[];
}

export interface TimeLinePoint {
  time: number;
  cluster: number;
  records: number[];
  props: number[];
}

export interface TimeString {
  value: string;
}

export interface Record {
  _id: string;
  note: string;
}

export interface Convo {
  _id: string;
  note: string;
  timeline: TimeLinePoint[];
  records: Record[];
}

export interface User {
  _id: string;
  auth_id: string;
  name: string;
  convos: Convo[];
}

export interface Status {
  volume: number;
  comments: number;
  points: number;
}
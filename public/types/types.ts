export interface TrackData {
  time: Date;
  values: number[];
}

export interface CommentData {
  time: Date;
  value: string;
}

export interface RawCommentData {
  time: number;
  value: string;
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
  comments: RawCommentData[];
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
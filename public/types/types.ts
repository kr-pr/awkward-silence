export interface TimeVector {
  time: number;
  value: number;
}

export interface TimeString {
  time: number;
  value: string;
}

export interface Record {
  _id: string;
  note: string;
}

export interface Convo {
  _id: string;
  note: string;
  timeline: TimeVector[];
  records: Record[];
}

export interface User {
  _id: string;
  auth_id: string;
  name: string;
  convos: Convo[];
}

export interface Status {
  comments: number;
  points: number;
}
export enum LiveStatus {
  Created = 1,
  Canceled,
  Started,
  Ended
}

export enum LiveType {
  Text = <any>'text',
  Video = <any>'video',
  App = <any>'app',
}

export enum LiveStreamStatus {
  None = <any>'',
  Pushing = <any>'publish',
  Done = <any>'publish_done',
}

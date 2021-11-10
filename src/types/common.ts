export interface SupOptType {
  sSupId: string;
  sSupName: string;
}

export interface CommonType extends Object {
  SupOpt: SupOptType[]
}

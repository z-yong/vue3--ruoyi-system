export interface OrgType {
  sort?: number;
  sOrgId: string;
  sOrgName: string;
}

export interface UserType extends Object {
  token: string;
  avatar: string;
  sUserCode: string;
  sSelfCode: string;
  sUserId: string;
  sUserName: string;
  roles: any[];
  permissions: any[];
  currentOrg: OrgType;
  sOrgList: OrgType[];
  sOwnerId: string;
  nTypeId: string;
  messageDataNum: number;
}

export interface LoginType {
  sUserCode: string;
  sPassword: string;
}

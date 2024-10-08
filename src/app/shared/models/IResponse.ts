export interface IResponse<T> {
  dataList: T[];
  singleData: T;
  thereIsError: boolean;
  entityId: number;
  successful: boolean;
  message: string;
  errors: string[];
}

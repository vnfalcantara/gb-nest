export class RequestQuery {
  match?: object = {}
  fields?: object = {}
  options: RequestQueryOptions
}

export class RequestQueryOptions {
  sort?: object
  skip?: number
  limit?: number
}
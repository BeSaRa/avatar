String.prototype.change = function (this: string, param?: IChangeParams): string {
  if (!param) {
    return this
  }
  return Object.keys(param).reduce((value, key) => {
    return value
      .replaceAll(':' + key, ('(' + param[key] + ')') as string)
      .replaceAll(`{{${key}}}`, param[key] as string)
      .replaceAll(`{${key}}`, param[key] as string)
  }, this)
}

String.prototype.getExtension = function (): string {
  return this.substring(this.lastIndexOf('.'))
}

type DecoratorWithArgs = [(...args: any[]) => MethodDecorator, any[]]
type AllowedDecorator = MethodDecorator | DecoratorWithArgs

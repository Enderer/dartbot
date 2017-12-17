declare module jasmine {
    interface Matchers<T> {
        toBeImmutable(args: any[]): boolean;
    }
}
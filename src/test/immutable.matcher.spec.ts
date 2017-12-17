import * as _ from 'lodash';

const immutableMatcher: jasmine.CustomMatcherFactories = {
    toBeImmutable: (
        util: jasmine.MatchersUtil, 
        customEqualityTesters: Array<jasmine.CustomEqualityTester>) => {

        return {
            compare: (actual: Function, args: any[]): jasmine.CustomMatcherResult => {
                const orig = args.map(_.cloneDeep);  
                actual.apply(undefined, args);
                const pass = _.isEqual(orig, args);
                return { pass };
            }
        };
    }
};

export { immutableMatcher };

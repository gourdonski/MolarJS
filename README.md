# MolarJS![molar](https://cloud.githubusercontent.com/assets/4038675/12056855/d98d79cc-aef8-11e5-8221-80dabf01bf50.png)
Yet another JavaScript library with a (debatably) nifty name.  Still has its baby teeth. 

## Lookup
A convenient way to manage collections of objects, including setting a TTL.

### Basic usage

    var foo = new molar.Lookup(false); //allow dupe keys is false
    foo.add('1', { bar: '1' });
    foo.add('2', { bar: '2' });
    foo.add('3', { bar: '3' });
    foo.add('3', { bar: '4' });

    var count = foo.count(); //count is 3, because dupe keys set to false

    var results = foo.findBy(obj => /\d+/.test(obj.key)); //results contains 3 items, because all keys are digits

## Mapper
Self-documenting object mapping in your code.  

### Basic usage

    var mapper = new molar.Mapper();
    
    var foo = { name: '1', value: '1' };

    mapper.register(new molar.MapperDef('Bar', false) //auto-map set to false
        .define('Foo to bar')
        .addMap('value', 'value')
        .addMap('value', 'id', src => +src + 1)); //transform and map

    var bar = mapper.map(foo, 'Bar'); //bar is { value: '1', id: 2 }

## Mutant
Keep track of when properties on an object change.

### Basic usage

    var obj = new molar.Mutant({ id: 1, name: 'obj' });

    obj.id = 2;

    var isMutated = obj.mutated(); //true

    obj.id = 1;

    isMutated = obj.mutated(); //false because reverted

    obj.id = 2;
    obj.name = 'mutant';

    obj.rebase();

    isMutated = obj.mutated(); //false because rebased

    obj.id = 1;
    obj.name = 'obj';

    isMutated = obj.mutated(); //true because no longer based on original obj

## Ready
Determine if a date/time intersects a complex time interval.  Cron for intervals.

### Basic usage

    var ready = new molar.Ready('* 19-23 * * 2,4 *'); //every Tuesday and Thursday between 7-11PM
    
    var intersects = ready.intersects(new Date()); //true if current time intersects interval
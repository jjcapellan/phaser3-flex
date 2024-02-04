export function assert(title, assertions, counter) {
    console.log("\n", title);

    let pass = true;

    assertions.forEach(a => {
        if (a.exp !== a.act) {
            console.log(`Error: ${a.prop} --> expected: ${a.exp} actual: ${a.act}`);
            pass = false;
        }
    });

    if (pass) {
        console.log("\x1b[32m **OK** \x1b[0m");
        counter.passed++;
    } else {
        console.log("\x1b[31m **FAIL** \x1b[0m");
        counter.failed++;
    }

    console.log("---------------------------------");

    return pass;
}
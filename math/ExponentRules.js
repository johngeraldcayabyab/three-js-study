class ExponentRules {
    productRule(base1, exponent1, base2, exponent2) {
        if (base1 === base2) {
            let exponentSum = exponent1 + exponent2;
            return this.square(base1, exponentSum);
        }
    }

    quotientRule(base1, exponent1, base2, exponent2) {
        if (base1 === base2) {
            let exponentSum = exponent1 - exponent2;
            return this.square(base1, exponentSum);
        }
    }

    powerRule(base, exponent1, exponent2) {
        let multiplicand = exponent1 * exponent2;
        return this.square(base, multiplicand);
    }

    powerOfZero() {
        // quotient rule. divide by itself means 1
    }

    negativeExponent() {
        //
    }

    fractionalExponent() {

    }

    distributeOverProduct() {

    }

    distributeOverQuotient() {

    }

    square(number, exponent) {
        let newNumber = number;
        for (let i = 1; i < exponent; i++) {

        }
    }
}
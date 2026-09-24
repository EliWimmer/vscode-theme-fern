// Example code with various syntax elements and intentional issues

class ColorTester {
  #privateField = "hidden";
  static CONSTANT = 42;

  constructor(name) {
      this.name = name;
      this.count = 0;
      // Warning: unused variable
      let unusedVar = "warning";
  }

  async testColors() {
      const numbers = [1, 2, 3];
      let result = null;

      try {
          // Error: Cannot access private field
          console.log(otherInstance.#privateField);

          for (const num of numbers) {
              this.count += num;
          }

          const template = `Hello ${this.name}!`;

          result = await Promise.resolve(template);

      } catch (error) {
          throw new Error(`Failed test: ${error.message}`);
      }

      return result;
  }

  get status() {
      return {
          name: this.name,
          count: this.count,
          isActive: true,
          timestamp: new Date()
      };
  }
}

// Regular expressions
const regex = /^[a-z]+$/i;
const email = "test@example.com".match(/\w+@\w+\.\w+/);

// Template literal with expression
const message = `Count is ${ColorTester.CONSTANT}`;

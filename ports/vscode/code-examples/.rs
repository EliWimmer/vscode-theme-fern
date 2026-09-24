use std::collections::HashMap;

#[derive(Debug)]
struct User {
    name: String,
    age: u32,
    active: bool,
}

const MAX_POINTS: u32 = 100_000;

fn main() {
    let unused_variable = 42; // This will cause a warning

    let mut scores: HashMap<String, i32> = HashMap::new();
    scores.insert(String::from("Blue"), 10);

    let user = User {
        name: String::from("Alice"),
        age: 30,
        active: true,
    };

    // This will cause an error - trying to use a non-existent method
    user.nonexistent_method();

    let numbers = vec![1, 2, 3, 4, 5];
    let doubled: Vec<i32> = numbers
        .iter()
        .map(|x| x * 2)
        .collect();

    match user.age {
        0..=17 => println!("Minor"),
        18..=64 => println!("Adult"),
        _ => println!("Senior"),
    }

    let lambda = |x: i32| -> i32 { x + 1 };
    println!("Result: {}", lambda(5));
}

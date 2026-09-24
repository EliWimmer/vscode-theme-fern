package main

import (
    "fmt"
    "time"
)

const MaxRetries = 3

type User struct {
    ID        int64
    Name      string
    CreatedAt time.Time
    active    bool // warning: unexported field 'active' should be 'Active'
}

func (u *User) Activate() error {
    if u == nil {
        return fmt.Errorf("user is nil")
    }
    u.active = true
    return nil
}

// This function has an error - can't use := for package level variables
var globalUser := &User{} // This will cause a compilation error

func main() {
    user := &User{
        ID:        1,
        Name:      "Test User",
        CreatedAt: time.Now(),
    }

    // Unused variable will trigger a warning
    result := 42

    if err := user.Activate(); err != nil {
        panic(err)
    }

    // String formatting with different types
    fmt.Printf("User %d: %s created at %v\n", user.ID, user.Name, user.CreatedAt)

    // Channel and goroutine example
    ch := make(chan string)
    go func() {
        ch <- "Hello from goroutine!"
    }()

    msg := <-ch
    fmt.Println(msg)
}

#include <stdio.h>
#include <stdlib.h>

#define MAX_SIZE 100
#define SQUARE(x) ((x) * (x))

typedef struct {
    int id;
    float value;
    char* name;
} DataPoint;

// This function will cause a warning due to signed/unsigned comparison
int find_element(int arr[], int size) {
    for (size_t i = 0; i < size; i++) {
        if (arr[i] == 42) return i;
    }
    return -1;
}

int main(void) {
    const double PI = 3.14159;
    int numbers[] = {1, 2, 3};
    DataPoint* data = malloc(sizeof(DataPoint));

    // This will cause an error - dereferencing null pointer
    data = NULL;
    data->value = 42.0;

    char str[] = "Hello\nWorld";

    for (int i = 0; i < 3; ++i) {
        printf("%d squared is %d\n", numbers[i], SQUARE(numbers[i]));
    }

    return 0;
}

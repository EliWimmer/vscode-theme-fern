package com.example.demo;

import java.util.List;
import java.util.ArrayList;

@SuppressWarnings("unused")
public class SyntaxDemo {
    private static final int MAX_VALUE = 100;
    private String name;  // Will cause warning - unused private field

    public interface DataProcessor {
        void process(String data);
    }

    public enum Status {
        ACTIVE,
        PENDING,
        INACTIVE
    }

    @Override  // Will cause error - nothing to override
    public List<String> processItems(String[] items) {
        List<String> results = new ArrayList<>();

        for (String item : items) {
            if (item != null) {
                results.add(item.toUpperCase());
            }
        }

        // Testing number literals
        double value = 3.14159;
        int hex = 0xFF00FF;
        long bigNum = 1000000L;

        // Testing string and char literals
        String text = "Hello, World!";
        char quote = '\"';

        return results;
    }

    public <T extends Comparable<T>> void genericMethod(T item) {
        System.out.println(item.toString());
    }
}

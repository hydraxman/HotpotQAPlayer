package com.bryan.hotpotqa.player.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class Result {
    private int code;
    private String message;
    private Object content;

    public static Result ok() {
        return Result.builder().code(200).message("OK!").build();
    }

    public static Result ok(Object content) {
        return Result.builder().code(200).message("OK!").content(content).build();
    }

    public static Result error(int code) {
        return Result.builder().code(code).message("error").build();
    }

    public static Result error(int code, String message) {
        return Result.builder().code(code).message(message).build();
    }

    public static Result error(int code, Throwable throwable) {
        return Result.builder().code(code).message(throwable.getClass().getName() + ": " + throwable.getMessage()).build();
    }
}

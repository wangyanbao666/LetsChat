package com.commons.methods;

import java.util.UUID;

public class UUIDGenerator {
    public static String generate(){
        UUID uuid = UUID.randomUUID();
        return uuid.toString();
    }
}

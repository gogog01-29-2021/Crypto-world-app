package com.siyamuddin.blog.blogappapis.Services.Impl;

import com.siyamuddin.blog.blogappapis.Services.DynamicConfigService;
import com.siyamuddin.blog.blogappapis.Services.PasswordValidationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class PasswordValidationServiceImpl implements PasswordValidationService {
    
    @Autowired
    private DynamicConfigService dynamicConfig;
    
    @Override
    public void validatePassword(String password) {
        if (password == null) {
            throw new IllegalArgumentException("Password cannot be null");
        }
        
        int minLength = dynamicConfig.getPasswordMinLength();
        int maxLength = dynamicConfig.getPasswordMaxLength();
        
        if (password.length() < minLength) {
            throw new IllegalArgumentException(
                String.format("Password must be at least %d characters long", minLength)
            );
        }
        
        if (password.length() > maxLength) {
            throw new IllegalArgumentException(
                String.format("Password must be at most %d characters long", maxLength)
            );
        }
        
        // Build a list of missing requirements for better error messages
        StringBuilder missingRequirements = new StringBuilder();
        
        if (dynamicConfig.getPasswordRequireUppercase() && !password.matches(".*[A-Z].*")) {
            missingRequirements.append("uppercase letter, ");
        }
        
        if (dynamicConfig.getPasswordRequireLowercase() && !password.matches(".*[a-z].*")) {
            missingRequirements.append("lowercase letter, ");
        }
        
        if (dynamicConfig.getPasswordRequireDigit() && !password.matches(".*[0-9].*")) {
            missingRequirements.append("digit, ");
        }
        
        if (dynamicConfig.getPasswordRequireSpecialChar() &&
            !password.matches(".*[@#$%^&+=!?*~`_\\-\\[\\]{}|\\\\:;\"'<>,./].*")) {
            missingRequirements.append("special character, ");
        }
        
        if (missingRequirements.length() > 0) {
            String requirements = missingRequirements.toString().replaceAll(", $", "");
            throw new IllegalArgumentException(
                String.format("Password must contain at least one %s", requirements)
            );
        }
    }
}


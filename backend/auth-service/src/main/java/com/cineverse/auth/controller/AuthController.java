package com.cineverse.auth.controller;

import com.cineverse.auth.model.User;
import com.cineverse.auth.repository.UserRepository;
import com.cineverse.auth.util.JwtUtil;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody User signUpUser) {
        if (userRepository.existsByUsername(signUpUser.getUsername())) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(signUpUser.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        // Create new user's account
        User user = new User();
        user.setUsername(signUpUser.getUsername());
        user.setPassword(passwordEncoder.encode(signUpUser.getPassword()));
        user.setEmail(signUpUser.getEmail());
        // Set default role if none specified
        user.setRole(signUpUser.getRole() == null ? "USER" : signUpUser.getRole().toUpperCase());

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Optional<User> userOpt = userRepository.findByUsername(loginRequest.getUsername());

        if (userOpt.isEmpty() || !passwordEncoder.matches(loginRequest.getPassword(), userOpt.get().getPassword())) {
            return ResponseEntity.status(401).body("Error: Invalid username or password!");
        }

        User user = userOpt.get();
        String jwt = jwtUtil.generateToken(user.getUsername(), user.getRole());

        Map<String, Object> response = new HashMap<>();
        response.put("token", jwt);
        response.put("username", user.getUsername());
        response.put("role", user.getRole());
        response.put("email", user.getEmail());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestParam String token) {
        boolean isValid = jwtUtil.validateToken(token);
        if (isValid) {
            String username = jwtUtil.extractUsername(token);
            String role = jwtUtil.extractClaim(token, claims -> claims.get("role", String.class));
            
            Map<String, Object> claims = new HashMap<>();
            claims.put("valid", true);
            claims.put("username", username);
            claims.put("role", role);
            return ResponseEntity.ok(claims);
        } else {
            return ResponseEntity.status(401).body("Token is invalid or expired");
        }
    }

    @Data
    public static class LoginRequest {
        private String username;
        private String password;
    }
}

package com.helloshoes.shoeshopmanagement.controller;

import com.helloshoes.shoeshopmanagement.dto.TypeDTO;
import com.helloshoes.shoeshopmanagement.service.TypeService;
import com.helloshoes.shoeshopmanagement.util.RegexUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/type")
@RequiredArgsConstructor
@Validated
public class TypeController {
    private final TypeService typeService;

    @GetMapping("/health")
    public String healthTest() {
        return "Type health tested";
    }

    @GetMapping
    public ResponseEntity<List<TypeDTO>> getAllTypes() {
        List<TypeDTO> typeDTOS = typeService.getAll();
        return ResponseEntity.ok().body(typeDTOS);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTypeByCode(@PathVariable String id) {
        if (!id.matches(RegexUtil.TYPE_REGEX)) {
            return ResponseEntity.badRequest().body("Invalid Type code format");
        }
        TypeDTO typeDTO = typeService.getByCode(id);
        if (typeDTO == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(typeDTO);
    }

    @PostMapping
    public ResponseEntity<?> createType(@RequestBody @Valid TypeDTO typeDTO) {
        TypeDTO savedType = typeService.save(typeDTO);
        if (savedType == null) {
            return ResponseEntity.badRequest().body("Failed to create Type");
        }
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(savedType.getTypeCode())
                .toUri();
        return ResponseEntity.created(location).body(savedType);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateType(@PathVariable String id, @RequestBody @Valid TypeDTO typeDTO) {
        if (!id.matches(RegexUtil.TYPE_REGEX)) {
            return ResponseEntity.badRequest().body("Invalid Type code format");
        }
        boolean isUpdated = typeService.update(id, typeDTO);
        if (!isUpdated) {
            return ResponseEntity.badRequest().body("Failed to update Type");
        }
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteType(@PathVariable String id) {
        if (!id.matches(RegexUtil.TYPE_REGEX)) {
            return ResponseEntity.badRequest().body("Invalid Type code format");
        }
        boolean isDeleted = typeService.delete(id);
        if (!isDeleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().build();
    }
}

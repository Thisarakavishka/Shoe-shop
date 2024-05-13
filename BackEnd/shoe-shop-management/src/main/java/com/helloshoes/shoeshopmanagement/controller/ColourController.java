package com.helloshoes.shoeshopmanagement.controller;

import com.helloshoes.shoeshopmanagement.dto.ColourDTO;
import com.helloshoes.shoeshopmanagement.service.ColourService;
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
@RequestMapping("/api/v1/colour")
@RequiredArgsConstructor
@Validated
@CrossOrigin
public class ColourController {
    private final ColourService colourService;

    @GetMapping("/health")
    public String healthTest() {
        return "Colour health tested";
    }

    @GetMapping
    public ResponseEntity<List<ColourDTO>> getAllColours() {
        List<ColourDTO> colourDTOS = colourService.getAll();
        return ResponseEntity.ok().body(colourDTOS);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getColourByCode(@PathVariable String id) {
        if (!id.matches(RegexUtil.COLOUR_REGEX)) {
            return ResponseEntity.badRequest().body("Invalid Colour code format");
        }
        ColourDTO colourDTO = colourService.getByCode(id);
        if (colourDTO == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(colourDTO);
    }

    @PostMapping
    public ResponseEntity<?> createColour(@RequestBody @Valid ColourDTO colourDTO) {
        ColourDTO savedColour = colourService.save(colourDTO);
        if (savedColour == null) {
            return ResponseEntity.badRequest().body("Failed to create Colour");
        }
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(savedColour.getColourCode())
                .toUri();
        return ResponseEntity.created(location).body(savedColour);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateColour(@PathVariable String id, @RequestBody @Valid ColourDTO colourDTO) {
        if (!id.matches(RegexUtil.COLOUR_REGEX)) {
            return ResponseEntity.badRequest().body("Invalid Colour code format");
        }
        boolean isUpdated = colourService.update(id, colourDTO);
        if (!isUpdated) {
            return ResponseEntity.badRequest().body("Failed to update Colour");
        }
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteColour(@PathVariable String id) {
        if (!id.matches(RegexUtil.COLOUR_REGEX)) {
            return ResponseEntity.badRequest().body("Invalid Colour code format");
        }
        boolean isDeleted = colourService.delete(id);
        if (!isDeleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().build();
    }
}

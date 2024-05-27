package com.helloshoes.shoeshopmanagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ColourDTO {

    @NotBlank(message = "Colour code is Required")
    @Pattern(regexp = "^COL\\d{3}$", message = "Invalid Color Code format")
    private String colourCode;

    @NotBlank(message = "Colour Name is Required")
    @Size(min = 3, max = 20, message = "Color Name must be between 3 and 20 characters")
    private String colourName;
}

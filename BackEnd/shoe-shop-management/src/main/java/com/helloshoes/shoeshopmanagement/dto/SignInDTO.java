package com.helloshoes.shoeshopmanagement.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SignInDTO {
    @NotNull
    @Email
    @NotEmpty
    private String email;
    @NotEmpty
    @NotEmpty
    private String password;
}

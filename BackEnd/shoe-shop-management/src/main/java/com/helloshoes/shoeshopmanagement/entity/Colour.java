package com.helloshoes.shoeshopmanagement.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "colour")
public class Colour {
    @Id
    private String colourCode;
    private String colourName;
    private String hexValue;
}

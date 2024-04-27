package com.helloshoes.shoeshopmanagement.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "colour")
public class Colour implements SuperEntity {
    @Id
    private String colourCode;
    private String colourName;
    private String hexValue;

    @ManyToMany(mappedBy = "colours")
    private List<Item> items;
}

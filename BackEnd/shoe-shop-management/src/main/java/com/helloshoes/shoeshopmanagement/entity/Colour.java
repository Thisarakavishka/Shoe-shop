package com.helloshoes.shoeshopmanagement.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
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

    @ManyToMany(mappedBy = "colours",cascade = CascadeType.ALL)
    @JsonBackReference
    private List<Item> items;
}

package com.helloshoes.shoeshopmanagement.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "type")
public class Type implements SuperEntity {
    @Id
    private String typeCode;
    private String typeName;
    private String typeCharacter;

    @ManyToMany(mappedBy = "types",cascade = CascadeType.ALL)
    @ToString.Exclude
    @JsonBackReference
    private List<Item> items;
}

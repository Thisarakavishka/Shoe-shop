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
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "type")
public class Type implements SuperEntity {
    @Id
    private String typeCode;
    private String typeName;
    private String typeCharacter;

    @ManyToMany(mappedBy = "types")
    private List<Item> items;
}

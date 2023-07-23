package com.commons.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddRemarkBody {
    private long userId;
    private long friendId;
    private String remark;
}

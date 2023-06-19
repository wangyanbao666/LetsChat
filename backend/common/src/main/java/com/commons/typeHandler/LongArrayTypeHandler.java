package com.commons.typeHandler;

import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedTypes;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.StringJoiner;

public class LongArrayTypeHandler extends BaseTypeHandler<List<Long>> {

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, List<Long> parameter, JdbcType jdbcType) throws SQLException {
        ps.setString(i, toString(parameter));
    }

    @Override
    public List<Long> getNullableResult(ResultSet rs, String columnName) throws SQLException {
        return this.toLongList(rs.getString(columnName));
    }

    @Override
    public List<Long> getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        return this.toLongList(rs.getString(columnIndex));

    }

    @Override
    public List<Long> getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        return this.toLongList(cs.getString(columnIndex));

    }

    private String toString(List<Long> params) {
        try {
            StringJoiner joiner = new StringJoiner(",");
            for (Long value : params) {
                joiner.add(value.toString());
            }

            String joinedArray = joiner.toString();
            return joinedArray;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";
    }

    private List<Long> toLongList(String content) {
        if (content != null) {
            try {
                if (content.isEmpty()){
                    return new ArrayList<>();
                }
                List<Long> result = new ArrayList<>();
                String[] values = content.split(",");
                for (String value : values) {
                    result.add(Long.parseLong(value));
                }
                return result;
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        } else {
            return null;
        }
    }
}


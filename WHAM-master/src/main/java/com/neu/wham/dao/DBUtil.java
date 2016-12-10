package com.neu.wham.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import com.neu.wham.keys.DBConstants;

public final class DBUtil {
	private static Connection conn = null;
	
	static{
		try {
			Class.forName("com.mysql.jdbc.Driver");
		} catch (ClassNotFoundException e) {
			System.out.println("Error in initializing the DB connection");
			e.printStackTrace();
		}
	}
	
	public static synchronized Connection getConnection() throws SQLException{
		if(conn==null){
			conn = DriverManager.getConnection(DBConstants.DB_URL,DBConstants.USER,DBConstants.PASS);
		}
		return conn;
	}
}

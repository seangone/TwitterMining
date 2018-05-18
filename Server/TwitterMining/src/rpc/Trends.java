package rpc;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import db.mongodb.MongoDBConnection;

/**
 * Servlet implementation class Trends
 */
@WebServlet("/trends")
public class Trends extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Trends() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//			JSONObject row1 = new JSONObject()
//					.put("hashtag", "#Shiyuan")
//					.put("firstTweet", "This is my first tweet.")
//					.put("time", "01/09/2018");
		String sNum = request.getParameter("num");
		int num = 3;
		if (sNum != null) {
			num = Integer.valueOf(sNum);
		}
		MongoDBConnection conn = new MongoDBConnection();
		JSONObject ja = null;
		try {
			ja = conn.getTrends(num);
		} catch (JSONException e) {
			e.printStackTrace();
		}
		conn.close();
		RpcHelper.writeJsonObject(response, ja);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}

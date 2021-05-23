package com.bryan.hotpotqa.player.service

import com.alibaba.fastjson.JSON
import com.alibaba.fastjson.JSONArray
import com.alibaba.fastjson.JSONObject
import org.springframework.stereotype.Service
import java.io.File
import org.apache.commons.lang3.StringUtils
import org.slf4j.Logger
import org.slf4j.LoggerFactory

data class RefInfo(
        val id: String,
        val jaroWinklerDistance: Double
)

data class TagInfo(
        val id: String,
        val tag: String
)

@Service
class ResultDataService {
    var idList: ArrayList<RefInfo> = ArrayList()
    var idNoNerList: ArrayList<RefInfo> = ArrayList()
    var levelTagList: ArrayList<TagInfo> = ArrayList()
    var typeTagList: ArrayList<TagInfo> = ArrayList()
    var typeList: ArrayList<String> = ArrayList()
    var typePredictionList: ArrayList<Int> = ArrayList()
    private lateinit var devSetArray: JSONArray
    private lateinit var nerJson: JSONObject
    private var objMap = HashMap<String, JSONObject>()
    private val logger: Logger = LoggerFactory.getLogger(ResultDataService::class.java)

    fun initialize() {
        devSetArray = JSON.parseArray(File("hotpot_dev_distractor_v1.json").readText())
        val file = File("ner.json")
        nerJson = if (file.exists()) {
            JSON.parseObject(file.readText())
        } else {
            JSONObject()
        }
        val predictJson = JSON.parseObject(File("pred.json").readText())

        val answerObj = predictJson.getJSONObject("answer")
        val supporting = predictJson.getJSONObject("sp")
        val typeProb = predictJson.getJSONObject("type_prob")
        val typePredict = predictJson.getJSONObject("type")

        for (i in 0 until devSetArray.size) {
            val jsonObject = devSetArray.getJSONObject(i)
            val id = jsonObject["_id"].toString()

            val type = jsonObject["type"].toString()
            val level = jsonObject["level"].toString()
            if (!typeList.contains(type)) {
                typeList.add(type)
            }
            levelTagList.add(TagInfo(id, level))
            typeTagList.add(TagInfo(id, type))

            val predicted = answerObj[id].toString().trim()
            val providedAnswer = jsonObject["answer"].toString().trim()

            val jaroWinklerDistance = StringUtils.getJaroWinklerDistance(predicted, providedAnswer)
            jsonObject["similarity"] = jaroWinklerDistance
            idList.add(RefInfo(id, jaroWinklerDistance))
            jsonObject["answer_prediction"] = predicted
            jsonObject["supporting_facts_in_prediction"] = supporting[id]

            jsonObject["type_prob"] = typeProb[id]

            val typePred = typePredict.getIntValue(id)
            jsonObject["type_prediction"] = typePred

            if (nerJson.getJSONObject(id) == null) {
                idNoNerList.add(RefInfo(id, jaroWinklerDistance))
            }

            if (!typePredictionList.contains(typePred)) {
                typePredictionList.add(typePred)
            }

            objMap[id] = jsonObject
        }

        logger.info("init finished")

    }

    fun getObjById(id: String): JSONObject? {
        return objMap[id]
    }

    fun getNerObjById(id: String): JSONObject? {
        return nerJson.getJSONObject(id)
    }

    fun getObjByIndex(index: Int): JSONObject? {
        return devSetArray.getJSONObject(index)
    }
}